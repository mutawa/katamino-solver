
# Katamino Solver

this is a hobby project in which I use JavaScript recursion to find solution(s) to a given katamino puzzle settings, (given such solution exists).

The project is not finished yet.

So far the following functions are available:

- Piece object that defines all possible 12 pieces and can rotate 90 degress
- Grid Object that can place a given piece by first detecting if it can fit, or if the selected location will cause the piece to go out of bound, or collides with an existing piece.
- The app will iterate through all possible empty squares on the grid and try to find the best orientation for pieces that haven't yet been placed. (will also try different rotations).


May features are to be added later.

- there are bugs in the way the app choses the pieces orientation.
- the grid must be able to detect if a piece placement will cause gaps that are not fillable by any of the remaining pieces.

Once the above bugs are solved, I plan to implement the main task:

- recursion function that finds possible solutions
- ability for the user to pre-fill the grid with any piece before starting the solver.