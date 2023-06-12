import type { NavigateFunction, Location } from "react-router-dom";

type HistoryType = {
    navigate: null | NavigateFunction
    location: null | Location
}

const history: HistoryType = {
    navigate: null,
    location: null
}

export default history



