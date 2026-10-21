#include <cstdio>

using namespace std;

double logarithm(double value) {
    double x = value;
    int exponent = 0;
    while (x >= 2.0) { x /= 2.0; ++exponent; }
    while (x < 1.0) { x *= 2.0; --exponent; }
    double t = (x - 1.0) / (x + 1.0);
    double term = t, sum = t;
    for (int n = 3; ; n += 2) {
        term *= t * t;
        double next = sum + term / n;
        if (next == sum) break;
        sum = next;
    }
    return 2.0 * sum + exponent * 0.693147180559945309417232121458176568;
}

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.14f\n", logarithm(x));
    }
    return 0;
}
