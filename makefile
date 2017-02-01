npm = npm
npmInstallFlag= install 
npmEndFlag = --save

nodeJsLib = discord.js basic-auth uws ytdl-core youtube-dl

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
#--------------------------


#-----------------------------------------------------


all: update


updateLib:
	$(npm) $(npmInstallFlag) $(nodeJsLib) $(npmEndFlag)
	
update: $(OBJ_FILES_CODE) clean $(nameOfSourceCodeArchive) unzipArchive 
#temp solution

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
	