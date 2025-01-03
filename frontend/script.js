document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent default form submission

    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];  // Get the selected file

    if (!file) {
        alert("Please select an image to upload.");
        return;
    }

    // Append the image to FormData
    formData.append('image', file);
    formData.append('fileName', file.name);  // Optional: include the file name

    // Send the form data (image file) to the backend via fetch API
    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData, // The image data
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // If the upload is successful, add the image to the gallery
            const gallery = document.getElementById('gallery');
            const imgElement = document.createElement('img');
            imgElement.src = data.imageUrl;  // ImageKit URL of the uploaded image
            imgElement.alt = 'Uploaded Image';
            imgElement.style.width = '100%';  // Optional: Resize the image
            imgElement.style.borderRadius = '10px';
            gallery.appendChild(imgElement);
        } else {
            // Handle errors if upload fails
            alert('Upload failed: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while uploading the image.');
    });
});
