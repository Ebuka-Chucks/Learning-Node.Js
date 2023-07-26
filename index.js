const express = require("express");
const app = express();
const port = 3000;
const meals = require("./data/meals")
// app.get, app.delete, app.patch, app.put, app.set, app.listen.
// status code 200
// setting the view engine
app.set("view engine", "ejs");

// middleware
// app.use((req, res, next) => {
//     console.log("request made");
//     next();
// });
app.use(express.json()); // Allows is to access the json file 
//get meals
app.get("/api/meals", (req, res) => {
    res.status(200).json({ numOfMeals: meals.length, meals });
});
// get single meal
app.get("/api/meals/:mealId", (req, res) => {
    res.send("get a single meal")
    //req.params 1 4 25
    //console,log(req.params.mealId)
    const { mealId } = req.params;
    const meals = meals.find((meal) => meal.id === parseInt(mealId));
    if (!meal) {
        return res.status(404).json({
            message: `Meal with the id ${mealId} not found`,
            success: false,
        });
    }
    res.status(200).json({success:true,meal})
})
//create a meal -
app.post("/api/meals", (req, res) => {
    //req.body
    // console.log(req.body);
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ message: "Please provide a meal name " });
    }
    const newMeal = { id: 8, name };
    res.status(201).json({ success: true, meals: [...meals, newMeal] });
    
});
//updating a meal
//Find what we want to update -get sth || undefined
//Provide what we want to update to 
app.patch("/api/meals/:mealId", (req, res) => {
    const { mealId } = req.params;
    const { name } = req.body;

    const meal = meals.find((meal) => meal.id === Number(mealId));
    if (!meal) {
        return res.status(404).json({ message: `meal with the id ${mealId} not found` });
    }
    if (!name) {
        return res.status(400).json({ message: "please provide a new meal name " });
    }
    const mealToBeUpdated = meals.map((meal) => {
        if (meal.id === Number(mealId)) {
            meal.name = name;
        }
        return meal;
    })
    return res.status(200).json({ success: true, meals: mealToBeUpdated });
});

//Deleting meals
app.delete("/api/meals/:mealId", (req, res) => {
    const { mealId } = req.params;

    const meal = meals.find((meal) => meal.id === Number(mealId));
    if (!meal) {
        return res.status(404).json({ message: `meal with the id ${mealId} not found ` });
    }
    const remaningMeals = meals.filter((meal) => meal.id !== parseInt(mealId));
    res.status(200).json({ success: true, meals: remaningMeals });
})








app.use((req, res, next) => {
    const requestInfo = {
        url: req.url,
        method: req.method,
        time: new Date().getDate(),
    };
    console.log(requestInfo);
    next();
});

const auth = (req, res, next) => {
    const authorized = false;
    if (authorized) {
        next();
    } else {
        res.send("you are not authorized");
    }
};

app.get("/account", auth, (req, res) => {
    res.status(200).send("Your Acoount Details");
});

app.get("/", (req, res) => {
    const user = "Funsho";
    const role = "Fullstack engineer";
    res.status(200).render("index", { user, role });
});
app.get("/about", (req, res) => {
    res.status(200).render("about");
});

//redirecting
app.get("/about-us", (req, res) => {
    res.redirect("/about");
});

// error route
// app.all("*", (req, res) => {
//   res.status(404).render("error");
// });

app.use((req, res) => {
    res.status(404).render("error");
});

app.listen(port, () => {
    console.log(`server running on port ${port}...`);
});