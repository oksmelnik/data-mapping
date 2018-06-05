Coding challange to map a data from different sources

You need Node to run this API.
Full catalog is accessible from the 4002/catalog endpoint

Challange description

For this assessment you will process a catalog with shoes as we receive it from a well-known shoe
supplier. You have received two different files that you need to accomplish this: pricat.csv and
mappings.csv

pricat.csv
This file is what we call a price catalog. It represents the catalog of a shoe supplier containing articles. It is
a flat format file that uses the semicolon ‘;’ as column separator. That means that every possible
configuration of a type of shoe is represented by a single line. For example, we have a shoe with article
number 15189-02-001 that is available in sizes 36, 37 and 38 and the colors black and white. However,
size 37 is only available in white. This would be represented by 5 records in the file:
- 15189-02-001;36;white - 15189-02-001;37;white
- 15189-02-001;38;white - 15189-02-001;36;black
- 15189-02-001;38;black
The pricat.csv has more of these variations. The first line represents the header of each column.
The goal of the assessment is to transform this price catalog into another format. The configuration of the
mapping is defined in the other file.

mappings.csv
This file is also a column separated file using the ‘;’ as separator with the first line as header. Each line
contains a mapping from a source field to a destination field. The simple example of the first two non-
header lines is as following:

Values of winter in the season column need to be mapped to the destination type season with value
Winter.
Values of summer in the season column need to be mapped to the destination type season with value
Summer.
It is also possible that multiple source values need to be combined into a new destination type. For
example, the value size_group_code need to be combined with the value of the size_code. Only with
those two columns combined you know to which destination value it needs to be mapped. The values EU
and 36 together become European size 36 with the type size.

Missing mappings
Not all columns are mapped in the mappings.csv. Columns that are not empty should be copied to the
same type in the result. An example of this is the brand column.

Grouping
As mentioned before, the pricat.csv is a flat file. We would like to have the result in a more structured way.
That structure looks as following:
Catalog —> Articles —> Variation
This means we create one catalog that contains multiple articles. Each article can contain multiple
variations. Have a look at the repeating values in the columns of the file to determine to which level each
field belongs. Here are some hints:
- the brand is the same in each record and therefore belongs to the Catalog
- the article_number as the name might suggest is unique for each Article

This would result in something as following:
+—————————————————————————————————+
| Catalog |
| brand: Via Vai |
| ?? |
| +——————————————————————————————+
| | Article |
| | article_number: 15189-02 |
| | ?? |
| | +———————————————————————————+
| | | Variation |
| | | ?? |
| | | ?? |
| | +———————————————————————————+
| | | Variation |
| | | ?? |
| | | ?? |
| | +———————————————————————————|
| +————————————————-—————————————+
| | Article |
| | article_number: 4701013-00 |
| | ?? |
| | +———————————————————————————+
| | | Variation |
| | | ?? |
| | | ?? |
| | +———————————————————————————+
| | | Variation |
| | | ?? |
| | | ?? |
| | +———————————————————————————|
| +————————————————-—————————————+
+—————————————————————————————————+

Output
The result should be the entire structured catalog, including all articles and variations, outputted in JSON
format. You’re free to determine the exact format but it should be something that could be returned by an
API.
