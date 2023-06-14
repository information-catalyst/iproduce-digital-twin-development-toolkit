./docker-build.sh
./docker-push.sh
rm -rf deploy_tmp || true
mkdir deploy_tmp
cp -r target/lib deploy_tmp/lib 2>/dev/null
cp target/* deploy_tmp 2>/dev/null
cp -r doxygen/html deploy_tmp 2>/dev/null
mv deploy_tmp/html deploy_tmp/doxygen
sh ~/artefacts/getfiles.sh 
