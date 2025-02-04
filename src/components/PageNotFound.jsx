import compassIcon from '../assets/icon/compass.png';

export default function PageNotFound() {
    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-pink-300 px-4 sm:px-6">
           <div className="top flex items-center gap-2 flex-wrap justify-center text-center">
                <img src={compassIcon} className="w-8 invert-[100%] max-w-full" />
                <h1 className="text-lg sm:text-xl text-pink-500 font-medium break-words" 
                    style={{ textShadow: "1px 1px 1px white" }}>
                    You were trying to access: {location.pathname}
                </h1>
            </div>

            <h1 className="404 font-bold text-pink-500 text-[150px] sm:text-[200px] md:text-[250px] lg:text-[300px]"
                style={{ textShadow: "5px 5px 1px white" }}>
                404
            </h1>

           <h1 className="text-slate-50 text-2xl sm:text-3xl md:text-4xl font-semibold text-center">
                Looks like you’re lost. Let’s get you {" "}
                <a className="text-pink-500 cursor-pointer underline"
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                    }}>
                    back!
                </a>
            </h1>
        </div>
    );
}console.log('PageNotFound component rendered');
console.log('Current URL:', location.pathname);