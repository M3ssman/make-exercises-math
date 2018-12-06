# Make Exercises Math
## Description
Makes Fundamental mathematical Exercises based on special Constraints or from provided Options. Exercises span simple Additions in Range [1 .. 20] up to the Subtraction of Fractions. I started this Project to automate the Creation of Mathematical Exercises for my kids when they started German Elementary School. 

// Serialization ?

## Exercise Types

The central API is called "makeSet". It expects Options for Exercise Types as Input and promises a Set of Exercise with Expressions and Rendered Output were some Parts of the Exercises (and the Result, too), are masked and therefore must be filled in.

Each ExerciseType is labelled with a prefix that determines it's Operation ("add", "sub", and so on), as well as it'n Numerical Range and Constraints for the Operands and/or the Result.

### Definition of Exercise Types - Options

The Exercise Options can be though of regular JSON with the following mandatory Properties:
* `set`: string  
  Numerical Range of Exercises, one of `'N'|'Q'` for Integers and Rational Numbers, both positive.
* `operations`: string[]  
  One of `'sum'|'sub'|'mult'|'div'|'addQ'|'subQ'|'multQ'|'divQ'`.
* `extension`: string  
  Type of Extension to generate: `'SINGLE_LINE' | 'ADD_CARRY' | 'SUB_CARRY' | 'MULT_SINGLE' | 'MULT_MULT' | 'DIV_EVEN' | 'ADD_FRACTION' | 'SUB_FRACTION' | 'MULT_FRACTION' | 'DIV_FRACTION'`  
  Determines additional, intermediate calculation Steps.  
  Originally, each resuting Extension (of course, it's a Collection) stands for an intermediate Calcuation Term. But as time went by, it evolved into a generic bucket for any kind of Rendering Informations. Threrefore, their actual Meaning, i.e., what kind of Term you are facing, depends strongly on the choosen ExerciseType.
* ```quantity```: number  
  Amount of Exercises, defaults depend on the ExerciseType in Range between 4 (div_even) and 12 (simple add).
* ```operands```: NumericalConstraint[]   
 List of Numerical Constraints that must hold for Operands.
* ```result```: NumericalConstraint  
  Numerical Constraints that must hold for the Result. 

### Numerical Constraints

Numerical Constraints for Operands and the Result.
* ```range```: number  
  Define Numerical Bounds for a Number, with a `max`: number and an optional `min`: number Value. In case of Fractions, they are represented by a rational Bi-Tuple like `max: [1,8]`
* ```greaterThanIndex```: number    
  Relation between Operands in the given Array
* ```exactMatchOf```: number   
  Define that Operand must match the given Number, usefull for Testing Purposes.
* ```multipleOf```: number  
  Restrict possible Integer Values to be a multiple of given Number. Usefull to enforce a certain Multiplicity. Does not work for Fractions.

Constraints are implemented in rather naive manner, without complex Validation Checks or defensive Programming. For Example, there's no check at `greaterThanIndex` that the compared Indizies *both* do exists. The User has to take Responsibility for Constraint Definitions to do make sense. 


### Examples
* A Basic Example (in JSON-Format) to define a Set of 3 Exercise Types that define ```add```, ```sub``` and ```mult```, could be done this way:  
  ```
  {
    "exercises":[
      { "quantity":12, 
        "operations":["add"],
        "operands":[
          {"range":{"min":10,"max":200}},
          {"range":{"max":100}}
        ]
      },
      { "quantity":12, 
        "operations":["sub"],
        "operands":[
          {"range":{"min":100,"max":200}},
          {"range":{"max":100}}
        ]
      },
      { "quantity":10, 
        "operations":["mult"],
        "operands":[
          {"range":{"min":2,"max":20}},
          {"range":{"max":15}}
        ]
      }
    ]
  }
  ```  
   The cruical Parts are proper numerical Bounds for each Operand. 


### Predefined Exercise Types
Out-of-the-Box, there are the following Exercises included:
* addN50N10
* addN50N19
* addN50N25Nof10
* subN50N10
* subN99N10Nof10
* subN99N19Nof10
* multN10N10
* add_add_
* addN50N25subN20
* divN100WithRest
* add_add_carry
* sub_carry
* mult_N999_N9
* mult_N999_N99
* mult_N999_N999
* div_even
* add_fraction
* sub_fraction
* mult_fraction
* div_fraction

The Name reflects the intents. What the Parts `add` or `div` stand for, is self-explanatory. The Operations are sometimes mixed with the numerical Ranges, to  signal the Numerical Range, especially in the beginning for [1 .. 20] or [1 .. 100]. Therefore, `subN99N19Nof10` means: "Subtraction Exercises, where the Minuend is between 1-99, the Subtrahend is between 0-19 and the final Difference is a multiple of 10". 

If explicite Numerical Ranges are missing, it is using defaults depending on the Exercises Type. The Fraction Exercises operate per default with Rational Numbers in a rather small Range [1/8 | 1/12 ... 2/3]. 

If the token `carry` is included, the Exercises Extension involves additional Carry Logic. In order to output each term independently, it returns an Array containing all involved Terms.  

See `src/exercises.math.options.ts` for further Details.

## Example Usage

Please go to [http://github.com/M3ssman/make-exercises-math-app](http://github.com/M3ssman/make-exercises-math-app) for further Explanations. 

## Installation 
After forking or cloning the Repository, switch to your local Repository root-Folder and run
```
npm i make-exercise-math --save
```

## Tests 
```
npm test
```

Test run collects Coverage Data using [nyc](https://github.com/istanbuljs/nyc#readme) and [mocha](https://mochajs.org/). 
