#include <cstdio>

using namespace std;

double cosine(double value) {
    long double x = value, term = 1.0L, sum = 1.0L;
    for (int n = 1; ; ++n) {
        term *= -x * x / ((2 * n - 1) * (2 * n));
        long double next = sum + term;
        if (next == sum) return static_cast<double>(sum);
        sum = next;
    }
}

int main() {
    int m;
    scanf("%d", &m);
    while (m--) {
        double x;
        scanf("%lf", &x);
        printf("%.14f\n", cosine(x));
    }
    return 0;
}
