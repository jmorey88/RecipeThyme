if (process.env.NODE_ENV === "production") {
  console.log(
    process.env.NODE_ENV,
    "<<<<<<<<<<<<<<<<<production!!!>>>>>>>>>>>>>>>"
  );
} else {
  console.log(process.env.NODE_ENV, "<<<<<<<dev?>>>>>>>>>");
}

const API_BASE_URL = process.env.NODE_ENV === "production";
("https://secure-fortress-86280-1b73326dc9fb.herokuapp.com/api");
("http://localhost:3000/api");

export default API_BASE_URL;
