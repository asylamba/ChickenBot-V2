npm = npm
npmInstallFlag= install 
npmEndFlag = --save

nodeJsLib = discord.js basic-auth uws ytdl-core youtube-dl

#-----------------------

wget = wget

cp = cp

unzip = unzip



nameOfSourceBranche = develop


nameOfRepo = ChickenBot-V2
linkToRepoArchive = "https://github.com/asylamba/$(nameOfRepo)/archive/$(nameOfSourceBranche).zip"

nameOfSourceCodeArchive = $(nameOfSourceBranche).zip
#nameOfSourceCodeArchive = test1.zip


nameOfArchiveSubFolder = $(nameOfRepo)-$(nameOfSourceBranche)


#----------------------------------------

rm = rm
rmRecursiveFlag = -r
rmSilentFlag = -f

SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)

OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))

.PHONY: test updateLib update unzipArchive all removeArchive deleteArchive deleteTempSourceFolder clean updatePart1 updatePart2 cpMakeFile makeDir
#--------------------------

make = make

#-----------------------------------------------------


all: update

makeDir:
	mkdir commandBot
	mkdir data
	mkdir data_bot
	mkdir doc
	mkdir mainBot
	mkdir musicBot
	mkdir test


test: override nameOfSourceBranche = test
test: update
	
updateLib:
	$(npm) $(npmInstallFlag) $(nodeJsLib) $(npmEndFlag)
	
updatePart1: $(nameOfSourceCodeArchive) unzipArchive

updatePart2: $(OBJ_FILES_CODE) clean

update: cpMakeFile $(OBJ_FILES_CODE) clean $(nameOfSourceCodeArchive) unzipArchive 
#temp solution

cpMakeFile:
	$(cp) $(nameOfArchiveSubFolder)/makefile makefile

#update: 
#	$(make) updatePart1
#	$(cp) $(nameOfArchiveSubFolder)/makefile makefile
#	$(make) updatePart2
	 

$(nameOfSourceCodeArchive):
	$(wget) $(linkToRepoArchive)

#-----------------------------------------------------

#setVar: override SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js)
#setVar: override OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE))
#setVar:
#	$(eval override SRC_FILES_CODE =  $(wildcard $(nameOfArchiveSubFolder)/*.js $(nameOfArchiveSubFolder)/*/*.js  $(nameOfArchiveSubFolder)/*/*/*.js))
#	$(eval override OBJ_FILES_CODE = $(subst $(nameOfArchiveSubFolder)/,,$(SRC_FILES_CODE)))
#	echo $(OBJ_FILES_CODE)
#	echo $(SRC_FILES_CODE)
#----------------------------------------------------
	
unzipArchive:
	$(unzip) $(nameOfSourceBranche)

#-----------------------------------------------------

	
%.js: 
	$(cp) $(nameOfArchiveSubFolder)/$@ $@

#-----------------------------------------------------

deleteArchive:
	$(rm) $(rmSilentFlag) $(nameOfSourceCodeArchive)
 
deleteTempSourceFolder:
	$(rm) $(rmSilentFlag) $(rmRecursiveFlag) $(nameOfArchiveSubFolder)

clean: deleteArchive deleteTempSourceFolder
	