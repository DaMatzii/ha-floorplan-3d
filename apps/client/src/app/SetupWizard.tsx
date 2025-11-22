import { Home } from "lucide-react";

export default function SetupWizard() {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("./api/upload/sh3d", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        response.json().then((json) => {
          alert(String(json));
          console.log(json);
        });
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error");
    }
  };
  return (
    <>
      <div className="flex w-screen h-screen bg-dark justify-center items-center">
        <div className="flex flex-col h-[75vw] w-[60vw]  bg-gradient-to-b from-light to-dark items-center text-text  rounded-xl border-1 border-border shadow-md ">
          <Home className="stroke-[0.1] text-aqua-500" size={200} />
          <h1 className="text-3xl mt-4 ">Welcome 3D floorplan</h1>

          <div className=" w-90 h-60 border-2 border-border bg-dark/200 rounded-xl mt-40 border-dashed flex flex-col items-center ">
            <div className="mt-15 flex flex-col items-center">
              <h1 className="text-text">Drag and drop .sh3d file</h1>
              <button className="w-40 h-8 bg-light mt-25 rounded-sm text-text border-1 border-border shadow-md ">
                <label>
                  Upload File
                  <input
                    type="file"
                    className="hidden"
                    accept=".sh3d"
                    onChange={handleFileChange}
                  />
                </label>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
//flex pl-2 flex-start bg-[hsl(0,0%,5%)] rounded-xl border-1 border-[hsl(0,0%,30%)] shadow-md shadow-[hsl(0,0%,10%)]
