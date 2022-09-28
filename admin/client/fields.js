module.exports = {
  azurefile: require('../../fields/types/azurefile/AzureFileField'),
  boolean: require('../../fields/types/boolean/BooleanField'),
  cloudinaryimage: require('../../fields/types/cloudinaryimage/CloudinaryImageField'),
  cloudinaryimages: require('../../fields/types/cloudinaryimages/CloudinaryImagesField'),
  code: require('../../fields/types/code/CodeField'),
  color: require('../../fields/types/color/ColorField'),
  date: require('../../fields/types/date/DateField'),
  datearray: require('../../fields/types/datearray/DateArrayField'),
  datetime: require('../../fields/types/datetime/DatetimeField'),
  email: require('../../fields/types/email/EmailField'),
  embedly: require('../../fields/types/embedly/EmbedlyField'),
  geopoint: require('../../fields/types/geopoint/GeoPointField'),
  gcsfile: require('../../fields/types/gcsfile/GcsFileField'),
  gcsimage: require('../../fields/types/gcsimage/GcsImageField'),
  gcsavatar: require('../../fields/types/gcsavatar/GcsAvatarField'),
  html: require('../../fields/types/html/HtmlField'),
  key: require('../../fields/types/key/KeyField'),
  localfile: require('../../fields/types/localfile/LocalFileField'),
  localfiles: require('../../fields/types/localfiles/LocalFilesField'),
  location: require('../../fields/types/location/LocationField'),
  markdown: require('../../fields/types/markdown/MarkdownField'),
  money: require('../../fields/types/money/MoneyField'),
  name: require('../../fields/types/name/NameField'),
  number: require('../../fields/types/number/NumberField'),
  numberarray: require('../../fields/types/numberarray/NumberArrayField'),
  password: require('../../fields/types/password/PasswordField'),
  preview: require('../../fields/types/preview/PreviewField'),
  relatedsformat: require('../../fields/types/relatedsformat/RelatedsFormatField'),
  relationship: require('../../fields/types/relationship/RelationshipField'),
  sortablerelateds: require('../../fields/types/sortableRelateds/SortableRelateds'),
  imagerelationship: require('../../fields/types/imagerelationship/ImageRelationshipField'),
  categorySet: require('../../fields/types/categorySet/CategorySet'),
  s3file: require('../../fields/types/s3file/S3FileField'),
  select: require('../../fields/types/select/SelectField'),
  titleposition: require('../../fields/types/titleposition/TitlePositionField'),
  text: require('../../fields/types/text/TextField'),
  textarea: require('../../fields/types/textarea/TextareaField'),
  textarray: require('../../fields/types/textarray/TextArrayField'),
  url: require('../../fields/types/url/UrlField'),

  // Remove relationshipForCategory, relationshipForTag when migration is done.
  relationshipForCategory: require('../../fields/types/relationship/RelationshipFieldForCategory'),
  relationshipForTag: require('../../fields/types/relationship/RelationshipFieldForTag'),
};
