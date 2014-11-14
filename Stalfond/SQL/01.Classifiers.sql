USE IsFrontOffice
GO

INSERT INTO Classifier (ID, Name, DisplayName, Description) VALUES ('7EDA7FD4-4BFA-4526-B03A-63552123E9B9', 'Статусы договора', 'Статусы договора','Статусы договора')
UPDATE ClassifierVersion SET [Owner] = '8B9D437D-2B55-488F-88B8-97683273E58A' WHERE VersionID = '7EDA7FD4-4BFA-4526-B03A-63552123E9B9'

INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('FC0700C4-A109-4F07-A6EA-B6C7381E2AFE' ,'FC0700C4-A109-4F07-A6EA-B6C7381E2AFE' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'New', 'Новый', 'Новый', 'Новый', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('FE8B38C3-BE66-4F33-B530-EB682180745E' ,'FE8B38C3-BE66-4F33-B530-EB682180745E' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'Draft', 'Черновики', 'Черновики', 'Черновики', 10, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F6E88880-E580-43F9-B2AB-095F8115D5E5' ,'F6E88880-E580-43F9-B2AB-095F8115D5E5' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'Saved', 'Заведенные', 'Заведенные', 'Заведенные', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F4063346-5532-4B06-BE35-3E323FD18A41' ,'F4063346-5532-4B06-BE35-3E323FD18A41' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'Printed', 'Напечатанные', 'Напечатанные', 'Напечатанные', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F933CD5E-5F4F-45F6-9874-C590A5072618' ,'F933CD5E-5F4F-45F6-9874-C590A5072618' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'OnCall', 'На обзвоне', 'На обзвоне', 'На обзвоне', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F627F998-99D2-45A8-AF98-C8F8090F82C8' ,'F627F998-99D2-45A8-AF98-C8F8090F82C8' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'AdditionalCall', 'Дополнительный звонок', 'Дополнительный звонок', 'Дополнительный звонок', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('FC60FCAA-4F94-4947-A36D-AB1BCA37DF27' ,'FC60FCAA-4F94-4947-A36D-AB1BCA37DF27' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'FondReject', 'Отказ Фонда', 'Отказ Фонда', 'Отказ Фонда', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F7DBEFC3-3359-4F96-94F6-585B1259BB63' ,'F7DBEFC3-3359-4F96-94F6-585B1259BB63' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'CallNotSuccesfull', 'Недозвон', 'Недозвон', 'Недозвон', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('FEB5593C-302D-4B9E-B3D6-E72EA258D908' ,'FEB5593C-302D-4B9E-B3D6-E72EA258D908' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'Successfull', 'Успешный', 'Успешный', 'Успешный', 1, null, null, null, null, null, null, null, null, null, '')
INSERT INTO [dbo].[ClassifierItem]            ([ID] ,[IndependentID] ,[ClassifierID] ,[ParentItemID] ,[CODE] ,[Name] ,[DisplayName] ,[Description] ,[ItemOrder] ,[Value1] ,[Value2] ,[Value3] ,[Value4] ,[Value5] ,[Value6] ,[Value7] ,[Value8] ,[Value9] ,[Value10])
     VALUES ('F423EC63-1C9C-4547-8322-8DA11B674BE1' ,'F423EC63-1C9C-4547-8322-8DA11B674BE1' ,'7EDA7FD4-4BFA-4526-B03A-63552123E9B9', null, 'Canceled', 'Аннулированный', 'Аннулированный', 'Аннулированный', 1, null, null, null, null, null, null, null, null, null, '')
GO


