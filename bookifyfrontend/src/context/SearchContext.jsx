import {createContext, useContext, useState} from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

const SearchContext = createContext();

export function useSearchContext(){
    return useContext(SearchContext);
}

export function SearchProvider({children}){
    const [searchInfo, setSearchInfo] = useState(null);
    const { removeItem } = useLocalStorage();

    const resetSearch = () => {
        setSearchInfo(null);
        removeItem("searchInfo");
    }

    return (
      <SearchContext.Provider value={ {searchInfo, setSearchInfo, resetSearch} }>
          {children}
      </SearchContext.Provider>
    );
}