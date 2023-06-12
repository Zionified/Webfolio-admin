import axios from "axios"
import MockAdapter from "axios-mock-adapter"

const mock =
    process.env.NODE_ENV === "development"
        ? new MockAdapter(axios)
        : new MockAdapter(axios.create())

export default mock
