#include <cstdio>

using namespace std;

double exponential(double value) {
    bool negative = value < 0.0;
    long double x = negative ? -static_cast<long double>(value) : value;
    int squarings = 0;
    while (x > 0.5L) { x /= 2.0L; ++squarings; }
    long double term = 1.0L, sum = 1.0L;
    for (int n = 1; ; ++n) {
        term *= x / n;
        long double next = sum + term;
        if (next == sum) break;
        sum = next;
    }
    while (squarings--) sum *= sum;
    if (negative) sum = 1.0L / sum;
    return static_cast<double>(sum);
}

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.14f\n", exponential(x));
    }
    return 0;
}
