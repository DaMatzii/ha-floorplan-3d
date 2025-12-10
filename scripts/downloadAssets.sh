#!/bin/bash

ZIP_URL="https://altushost-bul.dl.sourceforge.net/project/sweethome3d/SweetHome3D-source/SweetHome3D-7.5-src/SweetHome3D-7.5-src.zip?viasf=1"
DOWNLOAD_PATH="../temp/downloaded_file.zip"
EXTRACT_DIR="../temp"
FINAL_DESTINATION=$1


download_models() {
    echo "Starting download and unzip process..."

    echo "--- Step 1: Downloading file ---"
    curl --progress-bar -L -o "$DOWNLOAD_PATH" "$ZIP_URL"
    DOWNLOAD_STATUS=$?

    if [ $DOWNLOAD_STATUS -ne 0 ]; then
        echo "Error: Download failed (status code $DOWNLOAD_STATUS)."
        exit 1
    fi

    echo "Download done"
    mkdir -p "$EXTRACT_DIR"

    unzip -q -o "$DOWNLOAD_PATH" -d "$EXTRACT_DIR"
    UNZIP_STATUS=$?

    if [ $UNZIP_STATUS -ne 0 ]; then
        echo "Error: Unzipping failed (status code $UNZIP_STATUS). The file might be corrupted or not a valid zip."
        # rm -f "$DOWNLOAD_PATH"
        echo "Cleaned up temporary file ${DOWNLOAD_PATH}."
        exit 1
    fi

    # Delete download
    # rm -f "$DOWNLOAD_PATH"

}

convert() {
    echo "creating $EXTRACT_DIR/models/obj"
    mkdir -p $EXTRACT_DIR/models/obj""

    #Move needed things to models
    echo "moving models to $EXTRACT_DIR/models/obj"
    cp -r $EXTRACT_DIR/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/resources/* $EXTRACT_DIR/models/obj
    cp $EXTRACT_DIR/SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties $EXTRACT_DIR/models/

    echo "Printing files"
    mkdir -p $EXTRACT_DIR/models/gltf
    echo "Converting"

    for file in "$EXTRACT_DIR/models/obj"/*.obj; do
        if [ -f "$file" ]; then
            just_the_name=$(basename "$file")
            echo $just_the_name
            obj2gltf -i "$EXTRACT_DIR/models/obj/$just_the_name" -o "$EXTRACT_DIR/models/gltf/$just_the_name" > /dev/null
        fi
    done


}

mkdir -p $EXTRACT_DIR
mkdir -p $FINAL_DESTINATION

download_models
convert

echo "Finishing"
rm -rf "$EXTRACT_DIR/models/obj/"
ls -la "$EXTRACT_DIR/models"

cp -r "$EXTRACT_DIR/models" $FINAL_DESTINATION

#clean up
# rm -r "$EXTRACT_DIR"


echo "Script finished."
