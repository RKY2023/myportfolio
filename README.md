npx tailwindcss -i ./src/input.css -o ./src/output.css --watch


# to update the branch (deploy)
git fetch origin master:prevBranch
git push origin prevBranch:prevBranch
git push origin main:deployment

# to update the branch (master)
git fetch origin master:prevBranch
git push origin prevBranch:prevBranch
git push origin main:deployment
