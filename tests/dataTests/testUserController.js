/**
 * @fileoverview This file contains unit tests for user-related API operations,
 * ensuring user creation, retrieval, and error handling behave correctly.
 */

// Import required modules
const request = require("supertest");
const { createUser, getUserByEmail } = require("../../controllers/userController");
const { pool } = require("../../db/postgres");
const express = require("express");
const bcrypt = require("bcrypt");

// Mock PostgreSQL pool to prevent real database interactions
jest.mock("../../db/postgres", () => ({
    pool: {
        query: jest.fn()
    }
}));

/**
 * Runs test cases for user-related API operations.
 */
async function testUserController() {
    const app = express();
    app.use(express.json());

    // Define API endpoints for testing
    app.post("/api/users/createUser", createUser);
    app.post("/api/users/getUserByEmail", getUserByEmail);

    describe("User Controller API Tests", () => {
        beforeAll(() => {
            console.log("Starting User Controller Tests...");
        });

        afterAll(() => {
            console.log("Completed User Controller Tests.");
        });

        beforeEach(() => {
            jest.clearAllMocks(); // Reset mocks before each test
        });

        afterEach(() => {
            console.log("Test case executed.");
        });

        test("Should successfully create a user", async () => {
            // Mock database response for user creation
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, name: "John Doe", email: "johndoe@example.com", role: "tenant" }]
            });

            // Send request to create a new user
            const response = await request(app)
                .post("/api/users/createUser")
                .send({ name: "John Doe", email: "johndoe@example.com", password: "securepassword", role: "tenant" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "User created successfully!");
            console.log("Test Passed: User created successfully", response.body);
        });

        test("Should reject user creation with an invalid role", async () => {
            // Send request with an invalid role
            const response = await request(app)
                .post("/api/users/createUser")
                .send({ name: "Jane Doe", email: "janedoe@example.com", password: "securepassword", role: "invalidRole" });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Invalid Role!");
            console.log("Test Passed: Invalid role rejected");
        });

        test("Should handle duplicate email error", async () => {
            // Mock database error for duplicate email
            pool.query.mockRejectedValueOnce({ code: "23505" });

            // Send request to create a user with an existing email
            const response = await request(app)
                .post("/api/users/createUser")
                .send({ name: "John Doe", email: "johndoe@example.com", password: "securepassword", role: "landlord" });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Email already exists!");
            console.log("Test Passed: Duplicate email handled correctly");
        });

        test("Should retrieve a user by email", async () => {
            // Mock database response for retrieving user
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, name: "John Doe", email: "johndoe@example.com", role: "tenant" }]
            });

            // Send request to retrieve user
            const response = await request(app)
                .post("/api/users/getUserByEmail")
                .send({ email: "johndoe@example.com" });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("email", "johndoe@example.com");
            console.log("Test Passed: User retrieved successfully");
        });

        test("Should handle retrieval of a non-existent user", async () => {
            // Mock database response for non-existent user
            pool.query.mockResolvedValueOnce({ rows: [] });

            // Send request for a non-existent user
            const response = await request(app)
                .post("/api/users/getUserByEmail")
                .send({ email: "doesnotexist@example.com" });

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("error", "User not found!");
            console.log("Test Passed: Non-existent user handled correctly");
        });
    });
}

module.exports = testUserController;
