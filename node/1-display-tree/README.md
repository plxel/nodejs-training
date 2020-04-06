# PrintTree

This module prints to console json structre as a tree

To get started:

`npm start`

To print custom json - pass it as string:
`npm start "{\"name\":\"test1\",\"items\":[{\"name\":\"child\"}]}"`


For example, given this json as input:

```
const data = {
  "name": "1",
  "items": [
    {
      "name": 2,
      "items": [
        {
          "name": 3,
          "items": [
          	{
            	"name": 8
            },
            {
            	"name": 9
            }
          ]
        },
        {
          "name": 4,
          "items": [{ "name": 10 }]
        }
      ]
    },
    {
      "name": 5,
      "items": [
        {
          "name": 6,
          "items": [
          	{
            	"name": 7
            }
          ]
        }
      ]
    }
  ]
};
```

You will get this:

```

1
├──2
|  ├──3
|  |  ├──8
|  |  └──9
|  └──4
|     └──10
└──5
   └──6
      └──7

```
