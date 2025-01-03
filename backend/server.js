const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer"); // Import multer
const ImageKit = require("imagekit");

const app = express();
const PORT = 5000;

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: "public_X8xOkAhmx6wTppImxEcxXyXLqas=", // Replace with your ImageKit public key
    privateKey: "private_o8Cx6kUKaYw4iaA0lnD1DX5JP4U=", // Replace with your ImageKit private key
    urlEndpoint: "https://ik.imagekit.io/Gracy", // Replace with your ImageKit URL endpoint
});

// Set up multer to store uploaded files in memory (as a buffer)
const storage = multer.memoryStorage(); // Use memoryStorage for temporary storage
const upload = multer({ storage: storage }); // Create multer upload instance

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for GET /
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Endpoint to handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        const file = req.file; // The uploaded image file (from multer)
        const fileName = req.body.fileName || "default_name"; // Use the file name or a default

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Upload the image to ImageKit (converting file buffer to base64)
        const response = await imagekit.upload({
            file: file.buffer.toString("base64"), // Convert the file buffer to base64
            fileName: fileName, // Set the file name
        });

        // Respond with the uploaded image URL
        res.status(200).json({ success: true, imageUrl: response.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
