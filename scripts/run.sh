#!/bin/sh

echo STARTING APP


CONFIG_PATH ="${CONFIG_PATH}"
mkdir -p $CONFIG_PATH

if [ -z "$CONFIG_PATH" ]; then
    echo "SETUP FAILED: Missing APP_CONFIG_PATH"
    exit 1
fi

ZIP_URL="https://altushost-bul.dl.sourceforge.net/project/sweethome3d/SweetHome3D-source/SweetHome3D-7.5-src/SweetHome3D-7.5-src.zip?viasf=1"
DOWNLOAD_PATH="$CONFIG_PATH"/temp/models.zip
EXTRACT_DIR="$CONFIG_PATH"/temp
FINAL_DESTINATION="$CONFIG_PATH"/resources

mkdir -p $CONFIG_PATH/external
mkdir -p $CONFIG_PATH/internal

# ln $CONFIG_PATH /homeassistant/floorplan

# download_models() {
#     echo "Starting download and unzip process..."
#
#     echo "--- Step 1: Downloading file ---"
#     curl --progress-bar -L -o "$DOWNLOAD_PATH" "$ZIP_URL"
#     DOWNLOAD_STATUS=$?
#
#     if [ $DOWNLOAD_STATUS -ne 0 ]; then
#         echo "Error: Download failed (status code $DOWNLOAD_STATUS)."
#         exit 1
#     fi
#
#     echo "Download done"
#     mkdir -p "$EXTRACT_DIR"
#
#     unzip -q -o "$DOWNLOAD_PATH" -d "$EXTRACT_DIR"
#     UNZIP_STATUS=$?
#
#     if [ $UNZIP_STATUS -ne 0 ]; then
#         echo "Error: Unzipping failed (status code $UNZIP_STATUS). The file might be corrupted or not a valid zip."
#         echo "Cleaned up temporary file ${DOWNLOAD_PATH}."
#         exit 1
#     fi
# }
#

unzip_download() {
    ls -la /zips
    unzip -q -o "/zips/download.zip" -d "$EXTRACT_DIR"
    echo "unzip finished"
    ls -la $EXTRACT_DIR
    cd $EXTRACT_DIR
    pwd
    cd --
}

convert() {
    echo "creating $EXTRACT_DIR/models/obj"
    mkdir -p $EXTRACT_DIR/models/obj

    cp -r $EXTRACT_DIR/SweetHome3D-7-2.5-src/src/com/eteks/sweethome3d/io/resources/* $EXTRACT_DIR/models/obj
    cp $EXTRACT_DIR/SweetHome3D-7-2.5-src/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties $EXTRACT_DIR/models/

    mkdir -p $EXTRACT_DIR/models/gltf

    for file in "$EXTRACT_DIR/models/obj"/*.obj; do
        if [ -f "$file" ]; then
            echo "$EXTRACT_DIR/models/obj/$just_the_name"
            echo "$EXTRACT_DIR/models/gltf/$just_the_name"
            just_the_name=$(basename "$file")
            echo $just_the_name
            obj2gltf -i "$EXTRACT_DIR/models/obj/$just_the_name" -o "$EXTRACT_DIR/models/gltf/$just_the_name"
        fi
    done

    ls -la $EXTRACT_DIR/models/gltf

}




mkdir -p $EXTRACT_DIR
mkdir -p $FINAL_DESTINATION

# download_models
unzip_download
convert

echo "Finishing"
rm -rf "$EXTRACT_DIR/models/obj/"

cp -r "$EXTRACT_DIR/models" $FINAL_DESTINATION

#clean up
rm -r "$EXTRACT_DIR"

echo "Script finished."

echo "Bash script running pre-checks with config: $CONFIG_PATH"

export CONFIG_DIR=$CONFIG_PATH
export MODE=prod

exec /backend-exec
