# withApollo

A set of helper utilities to simplify testing with apollo client calls

- `withApolloProviderReturning` - for use in client tests. Wraps child JSX with a `MockedProvider`, returning a provided result. Example usage:

```
const { getByText } = render(withApolloProviderReturning(myResponseForTestCase, <MyComponentWhichMakesApolloCall />));
```

- `apolloMockResponse` - for use in client tests. Skips one process tick, allowing requests to return/re render. Example usage:

```
        ...
        // trigger the query
        userEvent.click(getByText('Search'));
        await apolloMockResponse();
        expect(getByText('Foo'));
        ....
```
