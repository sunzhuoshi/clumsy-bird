#!/bin/sh
#source config.sh

project=flappy-dragon
single_file=flappy-dragon-min.js
distr_files=(.htaccess $single_file index.css index.html privacy.html)
# DO NOT ADD the last '/'
#distr_dirs=(.ebextensions data)
# remove .ebxextension to reduce deployment time
distr_dirs=(data)
root_dir=$(pwd)
archive_dir=$(pwd)/archive
check_error()
{
	result=$?
	if [ $result -ne 0 ]; then
		echo error occurred, exit: $result
		exit $result
	fi
}
create_dir()
{
	echo creating dir $1
	if [ ! -d $1 ]; then
		mkdir $1
		check_error;
	fi
}

# read version from index.html
version=`cat index.html | grep VERSION= | sed "s/^[[:space:]]*var VERSION='\(.*\)';/\1/"`
#TODO: check version error
version_dir=$archive_dir/v$version
package_file_name=$project-v$version.zip
package_file=$archive_dir/$package_file_name
create_version_dir()
{
        create_dir $archive_dir
        create_dir $version_dir
}
echo 'start'
rm -f $single_file
echo 'compiling...'
ant
if [ $? -ne 0 ]; then
    exit $?
fi
create_version_dir

for file in ${distr_files[@]}; do
	cp -fv $file $version_dir/
	check_error
done

for dir in ${distr_dirs[@]}; do
	# rsync -av --exclude=".*" $dir $version_dir/
	rsync -av $dir $version_dir/
	check_error
done

cd $version_dir
echo "removing hidden file(s)..."
find . -name ".DS_Store"  | xargs rm -f
find . -name ".placeholder"  | xargs rm -f

echo packaging...
zip -r $package_file .

echo done!