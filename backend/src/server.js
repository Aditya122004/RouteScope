const express = require("express");
const cors = require("cors");

const ospfRoutes =
    require("./routes/ospfRoutes");
const errorHandler =
    require("./middleware/errorHandler");
const app = express();

app.use(cors());

app.use(express.json());

app.use(
    "/api/ospf",
    ospfRoutes
);

app.use(
    errorHandler
);
const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});