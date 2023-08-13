<?php

namespace MyNamespace;

/**
 * This class represents a basic example class in PHP.
 */
class ExampleClass
{
    // Properties
    private $name;

    // Constructor
    public function __construct($name)
    {
        $this->name = $name;
    }

    // Methods
    /**
     * Returns a greeting message.
     *
     * @param string $greeting The greeting to use.
     * @return string The formatted greeting message.
     */
    public function example() {
        if ($a == $b) {
              if ($a1 == $b1) {
                   fiddle();
              } elseif ($a2 == $b2) {
                   fiddle();
               } else {
                   fiddle();
               }
          } elseif ($c == $d) {
              while ($c == $d) {
                   fiddle();
               }
           } elseif ($e == $f) {
              for ($n = 0; $n < $h; $n++) {
                   fiddle();
               }
           } else {
               switch ($z) {
                  case 1:
                       fiddle();
                       break;
                 case 2:
                       fiddle();
                       break;
                 case 3:
                       fiddle();
                       break;
                   default:
                       fiddle();
                       break;
               }
           }
       }
}

// Usage
$name = "John";
$example = new ExampleClass($name);
$greeting = $example->greet("Hello");
echo $greeting;

?>
