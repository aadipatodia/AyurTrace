import aiofiles
from fastapi import FastAPI, UploadFile, File, Form
from pathlib import Path

# Create an instance of the FastAPI application
app = FastAPI()

# Define a path to store uploaded files
UPLOAD_DIRECTORY = Path("uploads")

@app.post("/submit_herb/")
async def submit_herb(
    herb_name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    image_file: UploadFile = File(...)
):
    # Create the uploads directory if it doesn't exist
    UPLOAD_DIRECTORY.mkdir(exist_ok=True)

    # Define the file path using the original filename
    file_location = UPLOAD_DIRECTORY / image_file.filename

    try:
        # Use aiofiles to write the file asynchronously
        async with aiofiles.open(file_location, "wb") as f:
            # Read the file in chunks to be memory-efficient
            while content := await image_file.read(1024):
                await f.write(content)

        print(f"File '{image_file.filename}' saved at '{file_location}'")
        return {"status": "success", "message": "Data received and image saved."}

    except Exception as e:
        # Handle potential errors during the file-saving process
        return {"status": "error", "message": f"There was an error saving the file: {e}"}