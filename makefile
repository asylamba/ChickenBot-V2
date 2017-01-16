npm = npm
npmInstallFlag= install 
npmEndFlag = --save

nodeJsLib = discord.js basic-auth uws erlpack discord.js-music 

#-----------------------

wget = wget

cp = cp

unzip = unzip

nameOfSourceBranche = master
nameOfRepo = ChickenBot-V2
linkToRepoArchive = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBranche).zip"

nameOfSourceCodeArchive = $(nameOfSourceBranche).zip

nameOfArchiveSubFolder = $(nameOfRepo)-$(nameOfSourceBranche)


#----------------------------------------

rm = rm
rmRecursiveFlag = -r
rmSilentFlag = -f

SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)

OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))

.PHONY: updateLib update unzipArchive all removeArchive deleteArchive deleteTempSourceFolder clean



#-----------------------------------------------------


all: update

updateLib:
	$(npm) $(npmInstallFlag) $(nodeJsLib) $(npmEndFlag)
	
update: unzipArchive OBJ_FILES_CODE clean

$(nameOfSourceCodeArchive):
	$(wget) $(linkToRepoArchive)

#-----------------------------------------------------

	
unzipArchive:
	$(unzip) $(nameOfSourceCodeArchive)

#-----------------------------------------------------

	
%.js: 
	$(cp) $(nameOfArchiveSubFolder)/$< $<

#-----------------------------------------------------

deleteArchive:
	$(rm) $(rmSilentFlag) $(nameOfSourceCodeArchive)
 
deleteTempSourceFolder:
	$(rm) $(rmSilentFlag) $(rmRecursiveFlag) $(nameOfArchiveSubFolder)

clean: deleteArchive deleteTempSourceFolder
	