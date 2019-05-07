set -e

for weight in Light Book Medium Bold; do
  for ext in eot woff ttf svg; do
    curl -o "ApexSans-${weight}.${ext}" \
      "https://cdn.jsdelivr.net/gh/RadiusIntelligence/frontend-exercises@5f18656c528a407e3647470a16bd24185dc26006/app/styles/fonts/apex-sans/ApexSans-${weight}.${ext}"
  done
done

curl -o "github-emojis.json" "https://api.github.com/emojis"
