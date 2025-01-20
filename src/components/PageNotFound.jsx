import compassIcon from '../assets/icon/compass.png'

export default function PageNotFound() {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen w-full bg-pink-300">
              <div className="top flex items-center gap-2">
                <img src={compassIcon} className="w-8 invert-[100%]" />
                <h1 className="text-xl text-pink-500 font-medium" style={{ textShadow: "1px 1px 1px white" }}>
                  You were trying to access: {location.pathname}
                </h1>
              </div>
              <h1
                className="404 font-bold text-pink-500 text-[350px]"
                style={{ textShadow: "10px 10px 1px white" }}
              >
                404
              </h1>
              <h1 className="text-slate-50 text-4xl font-semibold">
                  Looks like you’re lost. Let’s get you {" "}
                  <a
                    className="text-pink-500 cursor-pointer underline"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}
                  >
                    back!
                  </a>
                </h1>
            </div>
        </>
    )
}