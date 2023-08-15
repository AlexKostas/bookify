import {createContext, useContext, useState} from "react";

const SearchContext = createContext();

export function useSearchContext(){
    return useContext(SearchContext);
}

export function SearchProvider({children}){
    const [searchInfo, setSearchInfo] = useState(null);

    const resetSearch = () => setSearchInfo(null);

    return (
      <SearchContext.Provider value={ {searchInfo, setSearchInfo, resetSearch} }>
          {children}
      </SearchContext.Provider>
    );
}