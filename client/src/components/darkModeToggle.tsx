import { useEffect, useState } from "react";
import LocalStorage from "../hooks/localStorage";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined" && LocalStorage.getItem("theme")
      ? (LocalStorage.getItem("theme") as string)
      : "light",
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      LocalStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme} className="mx-5">
      {theme === "dark" ? (
        <FaMoon className="size-10 rounded-md border-2 border-solid border-light-lighter p-2 text-white transition-all hover:bg-slate-700" />
      ) : (
        <MdOutlineWbSunny className=" size-10 rounded-md border-2 border-solid border-dark-darker border-opacity-55 p-2 text-black transition-all hover:bg-slate-200" />
      )}
    </button>
  );
}
