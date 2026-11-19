import { createContext, useCallback, useContext, useEffect, useState } from "react";
const NoticeContext = createContext(null);
export const NoticeProvider = ({ children }) => {
 const [message,setMessage]=useState("");
 useEffect(()=>{if(!message)return;const timer=setTimeout(()=>setMessage(""),3000);return()=>clearTimeout(timer)},[message]);
 const showNotice=useCallback((text)=>setMessage(text),[]);
 return <NoticeContext.Provider value={showNotice}>{message&&<div className="app-notice" role="status">{message}</div>}{children}</NoticeContext.Provider>;
};
export const useNotice=()=>{const value=useContext(NoticeContext);if(!value)throw new Error("useNotice must be used inside NoticeProvider");return value;};
