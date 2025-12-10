#!/bin/bash

########################################
## SweetHome3D Model Downloader & Converter
##
## This script downloads the SweetHome3D source, extracts
## necessary 3D models (OBJ files), converts them to glTF,
## and copies the resulting models to a specified destination.
########################################

# --- Configuration Constants ---
readonly ZIP_URL="https://altushost-bul.dl.sourceforge.net/project/sweethome3d/SweetHome3D-source/SweetHome3D-7.5-src/SweetHome3D-7.5-src.zip?viasf=1"
readonly EXTRACT_DIR="./temp_sh3d_models"
readonly DOWNLOAD_PATH="${EXTRACT_DIR}/downloaded_file.zip"

# --- Source Paths within the extracted ZIP ---
readonly SOURCE_RESOURCES_DIR="SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/resources"
readonly SOURCE_PROPERTIES_FILE="SweetHome3D-7.5-src/src/com/eteks/sweethome3d/io/DefaultFurnitureCatalog.properties"

# --- Destination Paths within the temporary directory ---
readonly MODELS_DIR="${EXTRACT_DIR}/models"
readonly OBJ_DIR="${MODELS_DIR}/obj"
readonly GLTF_DIR="${MODELS_DIR}/gltf"

# --- Main Destination Variable ---
# $1 is the required final destination path
FINAL_DESTINATION="$1"

# ----------------------------------------------------------------------


download_and_extract() {
    echo "--- Step 1: Downloading and Extracting Source Files ---"

    mkdir -p "${EXTRACT_DIR}" || { echo " Error: Failed to create directory ${EXTRACT_DIR}."; exit 1; }

    echo "Downloading ${ZIP_URL}..."
    curl -# -L -o "${DOWNLOAD_PATH}" "${ZIP_URL}"
    local download_status=$?

    if [ "$download_status" -ne 0 ]; then
        echo " Error: Download failed (status code ${download_status})."
        exit 1
    fi

    echo "Extracting files to"
    unzip -q -o "${DOWNLOAD_PATH}" -d "${EXTRACT_DIR}"
    local unzip_status=$?

    if [ "$unzip_status" -ne 0 ]; then
        echo "Error: Unzipping failed (status code ${unzip_status}). File may be corrupted."
        exit 1
    fi
    echo "Extraction complete."
}

copy_and_convert_models() {
    echo "--- Step 2: Preparing and Converting Models ---"

    mkdir -p "${OBJ_DIR}" "${GLTF_DIR}" || { echo " Error: Failed to create model directories."; exit 1; }

    local source_obj_path="${EXTRACT_DIR}/${SOURCE_RESOURCES_DIR}/*"
    echo "Copying OBJ models from **${source_obj_path}** to **${OBJ_DIR}**..."
    cp -r "${source_obj_path}" "${OBJ_DIR}"

    local source_prop_file="${EXTRACT_DIR}/${SOURCE_PROPERTIES_FILE}"
    echo " Copying properties file to **${MODELS_DIR}**..."
    cp "${source_prop_file}" "${MODELS_DIR}/"

    echo " Starting model conversion from OBJ to glTF..."

    local obj_count=0
    local converted_count=0

    for file in "${OBJ_DIR}"/*.obj; do
        if [ -f "$file" ]; then
            obj_count=$((obj_count + 1))
            local just_the_name=$(basename "$file")
            local output_file="${GLTF_DIR}/${just_the_name%.*}.gltf" # Rename .obj to .gltf

            if obj2gltf -i "$file" -o "$output_file" &> /dev/null; then
                converted_count=$((converted_count + 1))
            else
                echo " Warning: Failed to convert ${just_the_name}."
            fi
        fi
    done

    echo "✅ Conversion finished. Processed **${obj_count}** files, **${converted_count}** converted to glTF."
}

finalize_and_cleanup() {
    echo "--- Step 3: Finalizing and Cleaning Up ---"

    echo "➡️ Copying final model files to **${FINAL_DESTINATION}**..."
    mkdir -p "${FINAL_DESTINATION}"
    cp -r "${MODELS_DIR}" "${FINAL_DESTINATION}"

    echo "🧹 Cleaning up temporary extraction and download files..."
    rm -rf "${EXTRACT_DIR}"
}

# ----------------------------------------------------------------------
# --- Main Script Execution ---
# ----------------------------------------------------------------------

if [ -z "$FINAL_DESTINATION" ]; then
    echo "❌ Error: Missing final destination argument."
    echo "Usage: $0 **<destination_directory>**"
    exit 1
fi


# Execute the steps
download_and_extract
copy_and_convert_models
finalize_and_cleanup

echo "---"
echo " Script finished successfully! Final models are located in **${FINAL_DESTINATION}/models**."
