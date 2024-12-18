import {Hono} from "hono";
import sys from "./sys";
import oss from "./oss";
import project from "./project";

const route = new Hono()

route.route('/sys', sys)
route.route('/oss', oss)
route.route('/project', project)

export default route
