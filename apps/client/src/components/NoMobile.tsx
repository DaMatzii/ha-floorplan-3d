import { MonitorX, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function NoMobile() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-screen h-screen bg-dark flex justify-center text-text">
        <div className="absolute top-[40vh] flex flex-col items-center">
          <MonitorX size={100} strokeWidth={0.5} />
          <h1 className="text-xl text-bold">
            Desktop mode is not yet supported :(
          </h1>
          <div className="items-center justify-center text-sm font-light">
            <span>If you wish to use the editor </span>
            <span
              className="underline hover:cursor-pointer"
              onClick={() => {
                console.log("CLICKED");
                navigate("./editor");
              }}
            >
              click here
            </span>
          </div>
        </div>

        <div className="text-text text-sm font-thin absolute bottom-2">
          <span className="">Feel free to contribute at </span>
          <span className="underline">Github</span>
        </div>
      </div>
    </>
  );
}
