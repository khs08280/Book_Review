import { useEffect, useState } from "react";
import LocalStorage from "../hooks/localStorage";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

export default function DarkModeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = LocalStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme as string);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    if (isMounted) {
      LocalStorage.setItem("theme", theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button onClick={toggleTheme} className="mx-5">
      {theme === "dark" ? (
        <FaMoon className=" size-10  rounded-md border-2 border-solid border-light-lighter p-2 text-white transition-all hover:bg-slate-700" />
      ) : (
        <MdOutlineWbSunny className=" size-10 rounded-md border-2 border-solid border-dark-darker border-opacity-55 p-2 text-black transition-all hover:bg-slate-200" />
      )}
    </button>
  );
}
