import { Home } from "lucide-react";
import React from "react";
import { ProgressButton } from "@/components/Button";
import { useNavigate } from "react-router-dom";

export default function SetupWizard() {
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef(undefined);
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;
    console.log(file);

    // setTimeout(() => {
    //   setLoading(false);
    //   navigate("../editor");
    // }, 500);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("./api/upload/sh3d", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        response.json().then((json) => {
          // alert(String(json));
          console.log(json);
          navigate("./editor");
        });
        setLoading(false);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };

  const containerVariants: any = {
    button: {
      width: 200,
      height: 50,
      borderRadius: 8,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
    loading: {
      width: 100,
      height: 50,
      borderRadius: 5,
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
  };

  return (
    <>
      <div className="w-screen h-screen bg-dark flex justify-center text-text">
        <div className="absolute top-[20vh] flex flex-col items-center">
          <Home size={100} strokeWidth={0.5} />
          <h1 className="text-xl text-bold">Welcome to use the 3D floorplan</h1>
          <div className="items-center justify-center flex flex-col text-sm font-light">
            <h1 className="text-text">
              Upload your Sweet Home 3d home to get started{" "}
            </h1>
            <div className="mt-5">
              <ProgressButton
                onClick={() => fileInputRef.current.click()}
                loading={loading}
                containerVariants={containerVariants}
              >
                Upload file (.sh3d file)
              </ProgressButton>
            </div>
          </div>
        </div>

        <input
          onChange={handleFileChange}
          multiple={false}
          ref={fileInputRef}
          type="file"
          hidden
        />
      </div>
    </>
  );
}
