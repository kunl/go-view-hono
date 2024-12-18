import {Hono} from "hono";
import {response} from "./utils";

const route = new Hono<{ Bindings: Bindings }>()
route.get('/', (c) => {
    const data = {

    }
    return c.json(response(data))
})

export default route
