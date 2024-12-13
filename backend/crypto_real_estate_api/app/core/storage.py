import os
from pathlib import Path
from typing import List
from fastapi import UploadFile, HTTPException
from ..core.config import settings

class LocalFileStorage:
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
    MAX_FILES = 10

    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def validate_file(self, file: UploadFile) -> None:
        # Check file extension
        ext = Path(file.filename).suffix.lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Allowed types: {', '.join(self.ALLOWED_EXTENSIONS)}"
            )

        # Check file size
        contents = await file.read()
        await file.seek(0)  # Reset file pointer
        if len(contents) > self.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {self.MAX_FILE_SIZE // (1024 * 1024)}MB"
            )

    async def save_file(self, file: UploadFile, property_id: int) -> str:
        """Save a file to local storage and return its URL path."""
        await self.validate_file(file)

        # Create unique filename
        ext = Path(file.filename).suffix.lower()
        filename = f"property_{property_id}_{os.urandom(8).hex()}{ext}"
        file_path = self.upload_dir / filename

        # Save file
        try:
            contents = await file.read()
            with open(file_path, "wb") as f:
                f.write(contents)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to save file: {str(e)}"
            )

        # Return the URL path
        return f"/uploads/{filename}"

    async def save_files(self, files: List[UploadFile], property_id: int) -> List[str]:
        """Save multiple files and return their URL paths."""
        if len(files) > self.MAX_FILES:
            raise HTTPException(
                status_code=400,
                detail=f"Maximum {self.MAX_FILES} files allowed per property"
            )

        urls = []
        for file in files:
            url = await self.save_file(file, property_id)
            urls.append(url)
        return urls

storage = LocalFileStorage()
