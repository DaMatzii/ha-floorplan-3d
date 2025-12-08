#!/bin/bash

ZIP_URL="https://sf-eu-introserv-1.dl.sourceforge.net/project/sweethome3d/SweetHome3D-source/SweetHome3D-7.5-src/SweetHome3D-7.5-src.zip?viasf=1"
DOWNLOAD_PATH="downloaded_file.zip"
EXTRACT_DIR="extracted_files"
OBJ_PATH="models/obj"

download_models() {
    echo "Starting download and unzip process..."

    echo "--- Step 1: Downloading file ---"
    curl -s -L -o "$DOWNLOAD_PATH" "$ZIP_URL"
    DOWNLOAD_STATUS=$?

    if [ $DOWNLOAD_STATUS -ne 0 ]; then
        echo "Error: Download failed (status code $DOWNLOAD_STATUS)."
        exit 1
    fi

    mkdir -p "$EXTRACT_DIR"

    unzip -q -o "$DOWNLOAD_PATH" -d "$EXTRACT_DIR"
    UNZIP_STATUS=$?

    if [ $UNZIP_STATUS -ne 0 ]; then
        echo "Error: Unzipping failed (status code $UNZIP_STATUS). The file might be corrupted or not a valid zip."
        rm -f "$DOWNLOAD_PATH"
        echo "Cleaned up temporary file ${DOWNLOAD_PATH}."
        exit 1
    fi

    # Delete download
    rm -f "$DOWNLOAD_PATH"

    mkdir -p models/obj

    #Move needed things to models
    cp -r extracted_files/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/resources/* models/obj
    cp extracted_files/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties models

    rm -r $EXTRACT_DIR

    echo "Printing files"

}


convert() {
    mkdir -p models/gltf
    echo "Converting"

    for file in "$OBJ_PATH"/*; do
        if [ -f "$file" ]; then
            just_the_name=$(basename "$file")
            echo $just_the_name
            obj2gltf -i $file -o models/gltf/$just_the_name
        fi
    done

    rm -r models/obj

}
download_models
convert


echo "Script finished."
