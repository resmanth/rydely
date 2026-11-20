// --- ImageKit SDK Initialization ---
// This file sets up the ImageKit SDK so the app can upload and manage images.
// It exports a configured ImageKit instance ready to use.

import ImageKit from "imagekit";
import dotenv from "dotenv";

// Load environment variables from .env file
// (server.js already loads dotenv, but we keep this so the module works standalone too)
dotenv.config();

// --- Create ImageKit Instance ---
// Uses three keys from environment variables to authenticate with ImageKit's API
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
