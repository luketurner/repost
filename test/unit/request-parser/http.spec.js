const expect = require("chai").expect;
const sinon = require("sinon");
require("chai").use(require("sinon-chai"));
const parser = require("../../../src/request-parser/http");

describe("module: request-parser/http", () => {
  describe("parse()", () => {
    it("should parse a GET request with no headers and no body (with double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\n\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        url: "/",
        method: "GET"
      });
    });

    it("should parse a GET request with no headers and no body (without double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        url: "/",
        method: "GET"
      });
    });

    it("should parse a GET request with a single header and no body (with double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\nContent-Type: application/json+foo\n\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: { "content-type": "application/json+foo" },
        url: "/",
        method: "GET"
      });
    });

    it("should parse a GET request with a single header and no body (without double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\nContent-Type: application/json+foo\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: { "content-type": "application/json+foo" },
        url: "/",
        method: "GET"
      });
    });

    it("should parse a GET request with multiple headers and no body (with double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\nContent-Type: application/json+foo\nOther-Header: Test Header\n\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: {
          "content-type": "application/json+foo",
          "other-header": "Test Header"
        },
        url: "/",
        method: "GET"
      });
    });

    it("should parse a GET request with multiple headers and no body (without double-newline)", () => {
      const rawRequest = `GET / HTTP/1.1\nContent-Type: application/json+foo\nOther-Header: Test Header`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: {
          "content-type": "application/json+foo",
          "other-header": "Test Header"
        },
        url: "/",
        method: "GET"
      });
    });

    it("should parse a POST request with no headers and a body", () => {
      const rawRequest = `POST / HTTP/1.1\n\nThis is the body`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        data: "This is the body",
        url: "/",
        method: "POST"
      });
    });

    it("should parse a POST request with one header and a body", () => {
      const rawRequest = `POST / HTTP/1.1\nContent-Type: application/blueberry\n\nThis is the body`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: { "content-type": "application/blueberry" },
        data: "This is the body",
        url: "/",
        method: "POST"
      });
    });

    it("should parse a POST request with multiple headers and a body", () => {
      const rawRequest = `POST / HTTP/1.1\nContent-Type: application/blueberry\nOther-Header: My Header\n\nThis is the body`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        headers: {
          "content-type": "application/blueberry",
          "other-header": "My Header"
        },
        data: "This is the body",
        url: "/",
        method: "POST"
      });
    });

    it("should parse a POST request even if it uses windows \\r\\n linebreaks", () => {
      const rawRequest = `GET / HTTP/1.1\r\n\r\nThis is the body`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        data: "This is the body",
        url: "/",
        method: "GET"
      });
    });

    it("should not trim newline characters from body", () => {
      const rawRequest = `GET / HTTP/1.1\n\n\nThis is the body\n`;
      const request = parser.parse(rawRequest);
      expect(request).to.eql({
        data: "\nThis is the body\n",
        url: "/",
        method: "GET"
      });
    });
  });
});
