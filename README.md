# Make Exercises Math
## Description
NPM Library that makes Fundamental mathematical Exercises.

Supports simple Addition, Subtraction and Multiplication Exercises with two Operands and their Result using Value Contraints. 
For each exercise, you declare lower and upper Bounds of Operands both, and the Result, accordingly. 
The Lib provides a pre-defined Set of basic numerical Ranges. Each concrete ExerciseType is labelled with a prefix that determines it's Operation, it's Constraint on the Operands and some optional Constraints for the Result

Currently, it supports the following ExerciseTypes:
* addN50N10
* addN50N19
* addN50N25Nof10
* subN50N10
* subN99N10Nof10
* subN99N19Nof10
* multN10N10

The "addN50N10" means: "give me Exercises of Addition, where the first Summand is between 0-50 and the second between 0-19".
The "subN99N19Nof10" means: "give me Exercises of Subtraction, where the Minuend is between 1-99, the Subtrahend is between 0-19 and the final Difference is a multiple of 10". Under the hood, each simple Subtraction Exercise assures a positive Difference, since the Minuend is garanteed to be larger than what gets subtracted. Per default, it creates a Set of 12 Exercises for each requested ExerciseType.

For a very basic example head over to openshiftapps and request [http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make)  


Add the types-Parameter like this, to get a 3-column Worksheet:  
[http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10](http://make-exercises-math-app-make-exercises-math-app.a3c1.starter-us-west-1.openshiftapps.com/make?types=addN50N25Nof10,subN99N19Nof10,multN10N10)

ExerciseTypes are separated by comma and must be contained in the listed ExercisesTypes above. 

## Local Installation
After forking or cloning the Repository, switch to your local Repository root-Folder and run
```
npm install
```

## Run Tests
```
npm test
```
