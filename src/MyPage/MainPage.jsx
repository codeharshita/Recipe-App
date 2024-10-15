import {Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState,useEffect } from 'react';
import img from '../images/myChefLogo.png';
import newImg from '../images/NoRecipeFound.png';

const MainPage = () => {
  const [inputField, setInputField] = useState("");
  const [myMeals, setMyMeals] = useState([]);
  const [initialMeals, setInitialMeals] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [noMeals , setNoMeals] = useState(false);


  function handleInputChange(e) {
    setInputField(e.target.value);
    console.log(e.target.value);
  }


  useEffect(() => {
    reloadData().then((m) => {
      if (m.categories) {
        console.log(m.categories);
        setInitialMeals(m.categories);
      } else {
        setInitialMeals([]);
      }
    });
  }, []);

  async function reloadData() {
    try {
      let resp = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      let resData = await resp.json();
      return resData;
    } catch (e) {
      console.log(e.message);
    }
  }


  //Write a function for api logic

  const getMealData = async () => {
    const BASE_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const customUrl = `${BASE_URL}${inputField}`;
    console.log("My custom url is " + customUrl);
    let response = await fetch(customUrl);
    let promiseData = await response.json();
    return promiseData;
  };

  function showRecipes(meal) {
    setSelectedMeal(meal);
  }

  function handleClick() {
    try {
      //call api logic
      setSearched(true);
      getMealData().then((meal) => {
        if (meal.meals) {
          setMyMeals(meal.meals);
        } else if(meal.meals == null){
            console.log('No meals found!!');
            setNoMeals(true);
        }
      });
    } catch (e) {
      console.log(e.message);
    }
  }


  return (
    <>
    <div className="flex flex-col items-center justify-center bg-stone-100">
      <div className="w-full bg-current py-8 mb-4 relative">
        <div className="absolute left-10 top-2 ">
          <img src={img} alt="Logo" className="  h-32 w-25" />
        </div>
        <h1 className=" animate-bounce animate-infinite animate-ease-linear text-5xl font-serif text-center text-white">
          Délicieux: Find Your Recipe Here
        </h1>
      </div>
      <div className="flex w-full max-w-lg px-4 mb-6">
        <Input
          className="flex-grow"
          type="text"
          placeholder="Search for recipes..."
          value={inputField}
          onChange={handleInputChange}
        />
        <Button className="px-5 ml-3" type="submit" onClick={handleClick}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      
      <div className="flex justify-center items-center  ">
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12  ">
          {searched === false &&
            initialMeals.map((k) => ( 
              <div
                key={k.idCategory}
                className="max-w-xs shadow-2xl  overflow-hidden transform  bg-white  hover:bg-white transition hover:scale-125  rounded-lg "
              >
                <img
                  className=""
                  src={k.strCategoryThumb}
                  alt={k.strCategory}
                />
                <div className="px-6 py-4 text-center">
                  <div className="font-bold text-xl mb-2">
                    {k.strCategory}
                  </div>
                </div>
                <div className="px-6 py-4 text-center">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Category: {k.strCategory}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {searched === true &&
            myMeals.map((meal) => (
              <div
                key={meal.idMeal}
                className="max-w-xs bg-whiteshadow-2xl  overflow-hidden transform  bg-white  hover:bg-white transition hover:scale-125  rounded-lg "
              >
                <img
                  className="w-full"
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  onClick={() => showRecipes(meal)}
                />
                <div className="px-6 py-4 text-center">
                  <div className="font-bold text-xl mb-2">{meal.strMeal}</div>
                </div>
                <div className="px-6 py-4 text-center">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Category: {meal.strCategory}
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Area: {meal.strArea}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedMeal && (
        <div   className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-prose hs-scroll-inside-body-modal-label ">
            <h2  className="flex justify-center text-2xl font-seri font-bold mb-4">
              {selectedMeal.strMeal}
            </h2>
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="w-full mb-4"
            />
            <p className="flex justify-center ">
              {" "}
              <strong>Category: </strong>
              <div className="ml-3 ">{selectedMeal.strCategory}</div>
            </p>
            <p className="flex justify-center">
              {" "}
              <strong>Area: </strong>{" "}
              <div className="ml-3">{selectedMeal.strArea}</div>
            </p>
            <p className="mt-4">{selectedMeal.strInstructions}</p>
            <Button className="mt-4" onClick={() => setSelectedMeal(null)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {noMeals == true && searched === true && (
       <>
       <img  className="w-96" src={newImg}/>
       </>
      )}
    </div>
  </>
  )
}

export default MainPage
