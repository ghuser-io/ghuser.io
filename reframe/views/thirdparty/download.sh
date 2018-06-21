set -e

for weight in Light Book Medium Bold; do
  for ext in eot woff ttf svg; do
    curl -o "ApexSans-${weight}.${ext}" \
      "https://rawgit.com/RadiusIntelligence/frontend-exercises/master/app/styles/fonts/apex-sans/ApexSans-${weight}.${ext}"
  done
done
