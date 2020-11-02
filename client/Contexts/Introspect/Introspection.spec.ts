/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import expectationsBasic from "./mock/expectations-basic";
import expectationsMissingMutation from "./mock/expectations-missing-mutation";
import introspectionBasic from "./mock/mock-introspection";
import expectionsEmptyTopic from './mock/expectations-empty-topic';
import expectationsMissingType from "./mock/expectations-missing-type"
import introspectionMissingMutation from "./mock/mock-introspection-missing-mutation-type"
import introspectionUnsupportedFieldType from "./mock/mock-introspection-unsupported-field-type";
import introspectionUnindexable from "./mock/mock-introspection-unindexable";
import introspectionMissingMutationBlock from "./mock/mock-introspection-missing-mutation-block";
import introspectionWrongTypeOnTopic from "./mock/mock-introspection-wrong-type-on-topic";
import introspectionWrongTypeOnMutationBlock from "./mock/mock-introspection-wrong-type-on-mutation-block";
import {introspect} from "./Introspection";
import {entitiesBasic} from "./mock/mock-entities";

describe("Basic Introspection", () => {
    it("should match", () =>
    {
        const introspected = introspect(expectationsBasic, introspectionBasic);
        expect(introspected).toEqual(entitiesBasic);
    });
});

describe("Missing Type", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsMissingType, introspectionBasic)}).toThrowError("Unable to find a type for Foo");

    });
});

describe("Missing Mutation Type", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsMissingMutation, introspectionMissingMutation)}).toThrowError("mutations is empty");

    });
});

describe("Unsupported Field Type", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsBasic, introspectionUnsupportedFieldType)}).toThrowError("Unsupported graphql kind UNION for String");

    });
});

describe("Unindexable types", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsBasic, introspectionUnindexable)}).toThrowError("key identified by name must be of type string");

    });
});

describe("Missing mutation block", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsBasic, introspectionMissingMutationBlock)}).toThrowError("Unable to find a type for Mutation");

    });
});

describe("Wrong type on mutation block", () => {
    it("should error", () =>
    {
        expect(() => {introspect(expectationsMissingMutation, introspectionWrongTypeOnMutationBlock)}).toThrowError("mutations is empty");

    });
});

describe("Non object type", () => {
    it("should error", () =>
    {
        const introspected = introspect(expectionsEmptyTopic, introspectionWrongTypeOnTopic);
        expect(introspected);

    });
});

