clear
echo "Input username:"
read uname
echo "Input password:"
read -s pass
rm credentials.json
touch credentials.json
echo "{\"email\": \"$uname\", \"password\": \"$pass\"}" >> credentials.json
forever start amihan.js