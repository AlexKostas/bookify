import {createContext, useContext, useEffect, useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

const SearchContext = createContext();

export function useSearchContext(){
    return useContext(SearchContext);
}

export function SearchProvider({children}){
    const [searchInfo, setSearchInfo] = useState(null);
    const { removeItem, getItem } = useLocalStorage();

    const resetSearch = () => {
        setSearchInfo(null);
        removeItem("searchInfo");
    }

    useEffect(() => {
        if(searchInfo) return;
        const rawInfo = getItem('searchInfo')
        if(!rawInfo) return;

        const info = JSON.parse(rawInfo);

        if(info) setSearchInfo(info);
    }, []);

    return (
      <SearchContext.Provider value={ {searchInfo, setSearchInfo, resetSearch} }>
          {children}
      </SearchContext.Provider>
    );
}