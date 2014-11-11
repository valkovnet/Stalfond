DECLARE @classid uniqueidentifier --идентификатор, который говорит о том, что это продукт.
DECLARE @parentID uniqueidentifier --идентификатор папки, в которую будет добавлен продукт.
DECLARE @productID uniqueidentifier --новый идентификатор.
SET @classid = '61E8EF65-FC9C-467B-A0E9-9460D6629D22'
SET @parentID = '126B5BB6-4931-41AE-90B7-C4DF3D0E7E55'
SET @productID = '8B9D437D-2B55-488F-88B8-97683273E58A'
 
DECLARE @objectname VARCHAR(50)
DECLARE @displayname VARCHAR(50)
DECLARE @description VARCHAR(50)
SET @objectname = 'Stalfond'
SET @displayname = 'Stalfond'
SET @description = 'Stalfond'
 
IF NOT EXISTS (SELECT * FROM ObjectInstance WHERE ID=@productID)
BEGIN
	INSERT INTO v_cls_ProductDefinition (ID, ClassID, ObjectName, DisplayName, Description)
	VALUES (@productID, @classid, @objectname, @displayname, @description)
 
	INSERT INTO ObjectHierarchy (NodeID, ParentID)
	VALUES (@productID, @parentID)
-- Безопасность, что бы продукт было видно в админке
	EXEC dbo.SetRowPermission @productID, 'dBF2791B6-6640-4EE5-B2EC-C404B762413E', 'G', 'G', 'G';
-- Дистрибуция
INSERT INTO ProductDistribution ( productID, partyID , isAllow, isDeny) VALUES(@productID, 'BF2791B6-6640-4EE5-B2EC-C404B762413E' , 1, 0)
END
GO


